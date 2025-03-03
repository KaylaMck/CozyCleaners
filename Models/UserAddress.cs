using System.ComponentModel.DataAnnotations;

namespace CozyCleaners.Models;

public class UserAddress
{
    public int Id { get; set; }
    [Required]
    public int UserProfileId { get; set; }
    [Required]
    public string Street { get; set; }
    [Required]
    public string City { get; set; }
    [Required]
    public string State { get; set; }
    [Required]
    public string ZipCode { get; set; }
    public UserProfile UserProfile { get; set; }
}