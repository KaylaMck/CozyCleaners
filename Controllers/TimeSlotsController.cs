// TimeSlotsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CozyCleaners.Data;
using CozyCleaners.Models.DTOs;

namespace CozyCleaners.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TimeSlotsController : ControllerBase
    {
        private readonly CozyCleanersDbContext _dbContext;

        public TimeSlotsController(CozyCleanersDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/TimeSlots
        [HttpGet]
        public IActionResult GetTimeSlots()
        {
            var timeSlots = _dbContext.TimeSlots
                .Select(ts => new TimeSlotDTO
                {
                    Id = ts.Id,
                    DisplayTime = $"{ts.Title} ({ts.StartTime} - {ts.EndTime})"
                })
                .ToList();

            return Ok(timeSlots);
        }
    }
}