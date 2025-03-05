namespace CozyCleaners.Models.DTOs;

public class UpdateCleaningRequestDTO
{
    public DateTime Date { get; set; }
    public int TimeSlotId { get; set; }
    public int AddressId { get; set; }
    public List<int> ServiceIds { get; set; } = new List<int>();
}