namespace DataParser;

public class ArticleDataRow
{
    public string title { get; set; } = default!;
    public string text { get; set; } = default!;
    public string url { get; set; } = default!;
    public string[] authors { get; set; } = default!;
    public string timestamp { get; set; } = default!;
    public string tags { get; set; } = default!;
}