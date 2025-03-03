using System.ComponentModel.DataAnnotations;

namespace CozyCleaners.Models;

public class RequestService
{
    public int Id { get; set; }
    [Required]
    public int RequestId { get; set; }
    [Required]
    public int ServiceId { get; set; }
    [Required]
    public int Quantity { get; set; }
    public CleaningRequest Request { get; set; }
    public Service Service { get; set; }
}