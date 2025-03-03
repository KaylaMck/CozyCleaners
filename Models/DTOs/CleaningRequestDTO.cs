namespace CozyCleaners.Models.DTOs;

public class CleaningRequestDTO
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string TimeSlot { get; set; }
    public string Status { get; set; }
    public string Address { get; set; }
}