using System.ComponentModel.DataAnnotations;

namespace CozyCleaners.Models;

public class CleaningRequest
{
    public int Id { get; set; }
    [Required]
    public int ClientId { get; set; }
    [Required]
    public DateTime Date { get; set; }
    [Required]
    public int TimeSlotId { get; set; }
    [Required]
    public int StatusId { get; set; }
    [Required]
    public int AddressId { get; set; }
    public UserProfile Client { get; set; }
    public TimeSlot TimeSlot { get; set; }
    public Status Status { get; set; }
    public UserAddress Address { get; set; }
 }