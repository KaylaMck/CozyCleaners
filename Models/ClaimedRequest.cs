// ClaimedRequest.cs
using System.ComponentModel.DataAnnotations;

namespace CozyCleaners.Models;

public class ClaimedRequest
{
    public int Id { get; set; }
    [Required]
    public int RequestId { get; set; }
    [Required]
    public int CleanerId { get; set; }
    [Required]
    public DateTime ClaimedTime { get; set; }
    public CleaningRequest Request { get; set; }
    public UserProfile Cleaner { get; set; }
}