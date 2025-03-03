using System.ComponentModel.DataAnnotations;

namespace CozyCleaners.Models;

public class Status
{
    public int Id { get; set; }
    [Required]
    public string Title { get; set; }
}