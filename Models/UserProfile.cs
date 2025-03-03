using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace CozyCleaners.Models;

public class UserProfile
{
    public int Id { get; set; }
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]

    public string IdentityUserId { get; set; }

    public IdentityUser IdentityUser { get; set; }
}