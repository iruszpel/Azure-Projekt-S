namespace DataParser;

public class Program
{
    public static void Main(string[] args)
    {
        var csvPath = args[0];
        if (!File.Exists(csvPath))
            throw new FileNotFoundException("File not found", csvPath);

        var articles = new ArticleDataSet(csvPath, "azurkiblobstorage", "azurki-article-tagging");
    }
}

