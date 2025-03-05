namespace CozyCleaners.Models.DTOs;

// Update your CreateCleaningRequestDTO.cs
public class CreateCleaningRequestDTO
{
    public DateTime Date { get; set; }
    public int TimeSlotId { get; set; }
    public int AddressId { get; set; }
    public List<ServiceRequestDTO> Services { get; set; }
}

// Add this new class
public class ServiceRequestDTO
{
    public int Id { get; set; }
}