namespace DataParser;

public class Assets
{
    public string projectKind { get; set; } = default!;
    public Class[] classes { get; set; } = default!;
    public Document[] documents { get; set; } = default!;
}