namespace DataParser;

public class Document
{
    public string location { get; set; } = default!;
    public string language { get; set; } = default!;
    public string dataset { get; set; } = default!;
    public Class[] classes { get; set; } = default!;
}