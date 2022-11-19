using System.Globalization;
using CsvHelper;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DataParser;

public class ArticleDataSet
{
    public string projectFileVersion { get; set; }
    public string stringIndexType { get; set; }
    public Metadata metadata { get; set; }
    public Assets assets { get; set; }

    public ArticleDataSet(string csvPath, string containerName, string projectName)
    {
        projectFileVersion = "2022-05-01";
        stringIndexType = "Utf16CodeUnit";
        metadata = new Metadata()
        {
            projectKind = "CustomMultiLabelClassification",
            storageInputContainerName = containerName,
            projectName = projectName,
            multilingual = false,
            description = string.Empty,
            language = "en-us",
        };
        assets = new Assets()
        {
            projectKind = "CustomMultiLabelClassification",
        };

        var rows = Load(csvPath).ToList().Take(35000).ToList();

        assets.classes = rows.SelectMany(x => x.tags
            .Replace("[", string.Empty)
            .Replace("]", string.Empty)
            .Replace("'", string.Empty)
            .Split(',')
        )
            .GroupBy(x => x)
            .OrderByDescending(x => x.Count())
            .Take(199)
            .Select(x => new Class { category = x.Key })
            .ToArray();
        
        Console.WriteLine("Number of classes: " + assets.classes.Length);

        var datasetPaths = Path.Combine(csvPath, "../datasets");
        Directory.CreateDirectory(datasetPaths);
        
        assets.documents = rows.Select((x, i) =>
        {
            if (i % 100 == 0)
            {
                Console.WriteLine($"{i / (double) rows.Count * 100}% done");
            }
            var fileGuid = Guid.NewGuid().ToString();
            var classes = x.tags
                .Replace("[", string.Empty)
                .Replace("]", string.Empty)
                .Replace("'", string.Empty)
                .Split(',')
                .Select(y => new Class { category = y })
                .Where(y => assets.classes.Any(z => z.category == y.category))
                .ToArray();
            if(classes == null || classes.Length == 0)
            {
                return null;
            }
            File.WriteAllText(Path.Combine(datasetPaths, $"{fileGuid}.txt"), x.text);
            return new Document
            {
                location = $"/datasets/{fileGuid}.txt",
                language = "en-us",
                classes = classes,
                dataset = Random.Shared.NextDouble() < 0.8 ? "Train" : "Test",
            };
        }).Where(x => x != null).ToArray();

        var jsonResult = JsonConvert.SerializeObject(this);
        File.WriteAllText(Path.Combine(csvPath, "../dataset.json"), jsonResult);
    }

    private IEnumerable<ArticleDataRow> Load(string csvPath)
    {
        using (var reader = new StreamReader(csvPath))
        using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
        {
            return csv.GetRecords<ArticleDataRow>().ToList();
        }
    }
}