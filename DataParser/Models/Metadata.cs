namespace DataParser;

public class Metadata
{
    public string projectKind { get; set; } = default!;
    public string storageInputContainerName { get; set; } = default!;
    public string projectName { get; set; } = default!;
    public bool multilingual { get; set; } = default!;
    public string description { get; set; } = default!;
    public string language { get; set; } = default!;
}