namespace CozyCleaners.Models.DTOs;

public class CreateCleaningRequestDTO
{
    public DateTime Date { get; set; }
    public int TimeSlotId { get; set; }
    public int AddressId { get; set; }
    public List<Service> Services { get; set; }
}