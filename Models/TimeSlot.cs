using System.ComponentModel.DataAnnotations;

namespace CozyCleaners.Models;

public class TimeSlot
{
    public int Id { get; set; }
    [Required]
    public string Title { get; set; }
    [Required]
    public string StartTime { get; set; }
    [Required]
    public string EndTime { get; set; }
}