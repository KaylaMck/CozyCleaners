// CleanerController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CozyCleaners.Data;
using CozyCleaners.Models;
using CozyCleaners.Models.DTOs;
using System.Security.Claims;

namespace CozyCleaners.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Cleaner")]
    public class CleanerController : ControllerBase
    {
        private readonly CozyCleanersDbContext _dbContext;

        public CleanerController(CozyCleanersDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/Cleaner/available
        [HttpGet("available")]
        public IActionResult GetAvailableRequests()
        {
            try
            {
                // Get cleaning requests with status "Scheduled" (id=1)
                var requests = _dbContext.CleaningRequests
                    .Include(cr => cr.Status)
                    .Include(cr => cr.TimeSlot)
                    .Include(cr => cr.Address)
                    .Include(cr => cr.Client)
                    .Where(cr => cr.StatusId == 1) // Scheduled
                    .ToList();

                var availableRequests = new List<object>();

                foreach (var request in requests)
                {
                    // Get services for this request
                    var services = _dbContext.RequestServices
                        .Include(rs => rs.Service)
                        .Where(rs => rs.RequestId == request.Id)
                        .Select(rs => new ServiceDTO
                        {
                            Id = rs.Service.Id,
                            Name = rs.Service.Name,
                            Description = rs.Service.Description,
                            Price = rs.Service.Price
                        })
                        .ToList();

                    // Calculate total price
                    decimal totalPrice = services.Sum(s => s.Price);

                    availableRequests.Add(new
                    {
                        Id = request.Id,
                        Date = request.Date,
                        TimeSlot = request.TimeSlot.Title,
                        Address = $"{request.Address.Street}, {request.Address.City}, {request.Address.State} {request.Address.ZipCode}",
                        ClientName = $"{request.Client.FirstName} {request.Client.LastName}",
                        Services = services,
                        TotalPrice = totalPrice
                    });
                }

                return Ok(availableRequests);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/Cleaner/claim/{id}
        [HttpPost("claim/{id}")]
        public IActionResult ClaimRequest(int id)
        {
            try
            {
                var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var cleanerProfile = _dbContext.UserProfiles
                    .FirstOrDefault(up => up.IdentityUserId == identityUserId);

                if (cleanerProfile == null)
                {
                    return NotFound("Cleaner profile not found");
                }

                var request = _dbContext.CleaningRequests
                    .FirstOrDefault(cr => cr.Id == id && cr.StatusId == 1); // Status 1 = Scheduled

                if (request == null)
                {
                    return NotFound("Request not found or already claimed");
                }

                // Update the status to "In Progress" (StatusId 4)
                request.StatusId = 4; // In Progress

                // Create a ClaimedRequest entry
                _dbContext.ClaimedRequests.Add(new ClaimedRequest
                {
                    RequestId = id,
                    CleanerId = cleanerProfile.Id,
                    ClaimedTime = DateTime.Now
                });

                _dbContext.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Cleaner/assigned
        [HttpGet("assigned")]
        public IActionResult GetAssignedRequests()
        {
            try
            {
                var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var cleanerProfile = _dbContext.UserProfiles
                    .FirstOrDefault(up => up.IdentityUserId == identityUserId);

                if (cleanerProfile == null)
                {
                    return NotFound("Cleaner profile not found");
                }

                var assignedRequests = _dbContext.ClaimedRequests
                    .Include(cr => cr.Request)
                        .ThenInclude(r => r.Status)
                    .Include(cr => cr.Request)
                        .ThenInclude(r => r.TimeSlot)
                    .Include(cr => cr.Request)
                        .ThenInclude(r => r.Address)
                    .Include(cr => cr.Request)
                        .ThenInclude(r => r.Client)
                    .Where(cr => cr.CleanerId == cleanerProfile.Id && cr.Request.StatusId == 4) // Status 4 = In Progress
                    .ToList();

                var result = new List<object>();

                foreach (var claimed in assignedRequests)
                {
                    var request = claimed.Request;

                    // Get services for this request
                    var services = _dbContext.RequestServices
                        .Include(rs => rs.Service)
                        .Where(rs => rs.RequestId == request.Id)
                        .Select(rs => new ServiceDTO
                        {
                            Id = rs.Service.Id,
                            Name = rs.Service.Name,
                            Description = rs.Service.Description,
                            Price = rs.Service.Price
                        })
                        .ToList();

                    // Calculate total price
                    decimal totalPrice = services.Sum(s => s.Price);

                    result.Add(new
                    {
                        Id = request.Id,
                        Date = request.Date,
                        TimeSlot = request.TimeSlot.Title,
                        Address = $"{request.Address.Street}, {request.Address.City}, {request.Address.State} {request.Address.ZipCode}",
                        ClientName = $"{request.Client.FirstName} {request.Client.LastName}",
                        Services = services,
                        TotalPrice = totalPrice,
                        ClaimedTime = claimed.ClaimedTime
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/Cleaner/complete/{id}
        [HttpPost("complete/{id}")]
        public IActionResult CompleteRequest(int id)
        {
            try
            {
                var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var cleanerProfile = _dbContext.UserProfiles
                    .FirstOrDefault(up => up.IdentityUserId == identityUserId);

                if (cleanerProfile == null)
                {
                    return NotFound("Cleaner profile not found");
                }

                var claimed = _dbContext.ClaimedRequests
                    .Include(cr => cr.Request)
                    .FirstOrDefault(cr => cr.Request.Id == id && cr.CleanerId == cleanerProfile.Id);

                if (claimed == null)
                {
                    return NotFound("Request not found or not assigned to you");
                }

                // Update the status to "Completed" (StatusId 2)
                claimed.Request.StatusId = 2; // Completed

                _dbContext.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Cleaner/completed
        [HttpGet("completed")]
        public IActionResult GetCompletedRequests()
        {
            try
            {
                var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var cleanerProfile = _dbContext.UserProfiles
                    .FirstOrDefault(up => up.IdentityUserId == identityUserId);

                if (cleanerProfile == null)
                {
                    return NotFound("Cleaner profile not found");
                }

                var completedRequests = _dbContext.ClaimedRequests
                    .Include(cr => cr.Request)
                        .ThenInclude(r => r.Status)
                    .Include(cr => cr.Request)
                        .ThenInclude(r => r.TimeSlot)
                    .Include(cr => cr.Request)
                        .ThenInclude(r => r.Address)
                    .Include(cr => cr.Request)
                        .ThenInclude(r => r.Client)
                    .Where(cr => cr.CleanerId == cleanerProfile.Id && cr.Request.StatusId == 2) // Status 2 = Completed
                    .ToList();

                var result = new List<object>();

                foreach (var claimed in completedRequests)
                {
                    var request = claimed.Request;

                    // Get services for this request
                    var services = _dbContext.RequestServices
                        .Include(rs => rs.Service)
                        .Where(rs => rs.RequestId == request.Id)
                        .Select(rs => new ServiceDTO
                        {
                            Id = rs.Service.Id,
                            Name = rs.Service.Name,
                            Description = rs.Service.Description,
                            Price = rs.Service.Price
                        })
                        .ToList();

                    // Calculate total price
                    decimal totalPrice = services.Sum(s => s.Price);

                    result.Add(new
                    {
                        Id = request.Id,
                        Date = request.Date,
                        TimeSlot = request.TimeSlot.Title,
                        Address = $"{request.Address.Street}, {request.Address.City}, {request.Address.State} {request.Address.ZipCode}",
                        ClientName = $"{request.Client.FirstName} {request.Client.LastName}",
                        Services = services,
                        TotalPrice = totalPrice,
                        ClaimedTime = claimed.ClaimedTime
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}