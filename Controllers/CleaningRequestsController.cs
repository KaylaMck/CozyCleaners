// CleaningRequestsController.cs
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
    [Authorize]
    public class CleaningRequestsController : ControllerBase
    {
        private readonly CozyCleanersDbContext _dbContext;

        public CleaningRequestsController(CozyCleanersDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // POST: api/CleaningRequests
        [HttpPost]
        public IActionResult CreateCleaningRequest(CreateCleaningRequestDTO createDTO)
        {
            var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = _dbContext.UserProfiles
                .FirstOrDefault(up => up.IdentityUserId == identityUserId);

            if (userProfile == null)
            {
                return NotFound("User profile not found");
            }

            // Create the new cleaning request
            var newRequest = new CleaningRequest
            {
                ClientId = userProfile.Id,
                Date = createDTO.Date,
                TimeSlotId = createDTO.TimeSlotId,
                StatusId = 1, // Assuming 1 is "Scheduled"
                AddressId = createDTO.AddressId
            };

            _dbContext.CleaningRequests.Add(newRequest);
            _dbContext.SaveChanges();

            // Add the services for this request
            if (createDTO.Services != null && createDTO.Services.Count > 0)
            {
                foreach (var service in createDTO.Services)
                {
                    _dbContext.RequestServices.Add(new RequestService
                    {
                        RequestId = newRequest.Id,
                        ServiceId = service.Id,
                        Quantity = 1 // Default quantity
                    });
                }
                _dbContext.SaveChanges();
            }

            return Created($"/api/CleaningRequests/{newRequest.Id}", newRequest.Id);
        }

        // Add this to your CleaningRequestsController.cs
        [HttpGet]
        public IActionResult GetUserCleaningRequests()
        {
            try
            {
                var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userProfile = _dbContext.UserProfiles
                    .FirstOrDefault(up => up.IdentityUserId == identityUserId);

                if (userProfile == null)
                {
                    return NotFound("User profile not found");
                }

                var requests = _dbContext.CleaningRequests
                    .Include(cr => cr.Status)
                    .Include(cr => cr.TimeSlot)
                    .Include(cr => cr.Address)
                    .Where(cr => cr.ClientId == userProfile.Id)
                    .Select(cr => new CleaningRequestDTO
                    {
                        Id = cr.Id,
                        Date = cr.Date,
                        TimeSlot = cr.TimeSlot.Title,
                        Status = cr.Status.Title,
                        Address = $"{cr.Address.Street}, {cr.Address.City}, {cr.Address.State} {cr.Address.ZipCode}"
                    })
                    .ToList();

                return Ok(requests);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/CleaningRequests/{id}
        // Update your GetCleaningRequest method in CleaningRequestsController.cs to ensure 
        // it always recalculates the total price fresh from the database:

        [HttpGet("{id}")]
        public IActionResult GetCleaningRequest(int id)
        {
            try
            {
                var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userProfile = _dbContext.UserProfiles
                    .FirstOrDefault(up => up.IdentityUserId == identityUserId);

                if (userProfile == null)
                {
                    return NotFound("User profile not found");
                }

                var request = _dbContext.CleaningRequests
                    .Include(cr => cr.Status)
                    .Include(cr => cr.TimeSlot)
                    .Include(cr => cr.Address)
                    .FirstOrDefault(cr => cr.Id == id && cr.ClientId == userProfile.Id);

                if (request == null)
                {
                    return NotFound("Cleaning request not found");
                }

                // Get services for this request - fresh from the database
                var services = _dbContext.RequestServices
                    .Include(rs => rs.Service)
                    .Where(rs => rs.RequestId == id)
                    .Select(rs => new ServiceDTO
                    {
                        Id = rs.Service.Id,
                        Name = rs.Service.Name,
                        Description = rs.Service.Description,
                        Price = rs.Service.Price
                    })
                    .ToList();

                // Calculate total price based on all services
                decimal totalPrice = services.Sum(s => s.Price);

                var requestDetails = new
                {
                    Id = request.Id,
                    Date = request.Date,
                    TimeSlot = request.TimeSlot.Title,
                    Status = request.Status.Title,
                    Address = $"{request.Address.Street}, {request.Address.City}, {request.Address.State} {request.Address.ZipCode}",
                    Services = services,
                    TotalPrice = totalPrice
                };

                return Ok(requestDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/CleaningRequests/{id}/cancel
        [HttpPut("{id}/cancel")]
        public IActionResult CancelCleaningRequest(int id)
        {
            try
            {
                var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userProfile = _dbContext.UserProfiles
                    .FirstOrDefault(up => up.IdentityUserId == identityUserId);

                if (userProfile == null)
                {
                    return NotFound("User profile not found");
                }

                var request = _dbContext.CleaningRequests
                    .FirstOrDefault(cr => cr.Id == id && cr.ClientId == userProfile.Id);

                if (request == null)
                {
                    return NotFound("Cleaning request not found");
                }

                // Set status to Canceled (assuming 3 is the Canceled status id)
                request.StatusId = 3;
                _dbContext.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Add this method to your CleaningRequestsController.cs

        // PUT: api/CleaningRequests/{id}
        // PUT: api/CleaningRequests/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateCleaningRequest(int id, [FromBody] UpdateCleaningRequestDTO updateDTO)
        {
            try
            {
                var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userProfile = _dbContext.UserProfiles
                    .FirstOrDefault(up => up.IdentityUserId == identityUserId);

                if (userProfile == null)
                {
                    return NotFound("User profile not found");
                }

                var request = _dbContext.CleaningRequests
                    .FirstOrDefault(cr => cr.Id == id && cr.ClientId == userProfile.Id);

                if (request == null)
                {
                    return NotFound("Cleaning request not found");
                }

                // Only allow editing if the request is still scheduled (not in progress or completed)
                if (request.StatusId != 1) // 1 = Scheduled
                {
                    return BadRequest("Cannot edit a request that is already in progress or completed");
                }

                // Update the request details
                request.Date = updateDTO.Date;
                request.TimeSlotId = updateDTO.TimeSlotId;
                request.AddressId = updateDTO.AddressId;

                // Remove existing services
                var existingServices = _dbContext.RequestServices
                    .Where(rs => rs.RequestId == id)
                    .ToList();

                foreach (var service in existingServices)
                {
                    _dbContext.RequestServices.Remove(service);
                }

                _dbContext.SaveChanges();

                // Add the new services
                if (updateDTO.ServiceIds != null && updateDTO.ServiceIds.Count > 0)
                {
                    foreach (var serviceId in updateDTO.ServiceIds)
                    {
                        _dbContext.RequestServices.Add(new RequestService
                        {
                            RequestId = id,
                            ServiceId = serviceId,
                            Quantity = 1 // Default quantity
                        });
                    }
                }

                _dbContext.SaveChanges();

                // Get updated service information to return
                var updatedRequest = _dbContext.CleaningRequests
                    .Include(cr => cr.Status)
                    .Include(cr => cr.TimeSlot)
                    .Include(cr => cr.Address)
                    .FirstOrDefault(cr => cr.Id == id);

                var updatedServices = _dbContext.RequestServices
                    .Include(rs => rs.Service)
                    .Where(rs => rs.RequestId == id)
                    .Select(rs => new ServiceDTO
                    {
                        Id = rs.Service.Id,
                        Name = rs.Service.Name,
                        Description = rs.Service.Description,
                        Price = rs.Service.Price
                    })
                    .ToList();

                decimal totalPrice = updatedServices.Sum(s => s.Price);

                // Create the response object with updated data
                var responseObject = new
                {
                    Id = updatedRequest.Id,
                    Date = updatedRequest.Date,
                    TimeSlot = updatedRequest.TimeSlot.Title,
                    Status = updatedRequest.Status.Title,
                    Address = $"{updatedRequest.Address.Street}, {updatedRequest.Address.City}, {updatedRequest.Address.State} {updatedRequest.Address.ZipCode}",
                    Services = updatedServices,
                    TotalPrice = totalPrice
                };

                return Ok(responseObject);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Add this method to your CleaningRequestsController.cs

        // GET: api/CleaningRequests/completed
        [HttpGet("completed")]
        public IActionResult GetCompletedCleaningRequests()
        {
            try
            {
                var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userProfile = _dbContext.UserProfiles
                    .FirstOrDefault(up => up.IdentityUserId == identityUserId);

                if (userProfile == null)
                {
                    return NotFound("User profile not found");
                }

                // Get cleaning requests with status "Completed" (assuming StatusId 2 is "Completed")
                var requests = _dbContext.CleaningRequests
                    .Include(cr => cr.Status)
                    .Include(cr => cr.TimeSlot)
                    .Include(cr => cr.Address)
                    .Where(cr => cr.ClientId == userProfile.Id && cr.StatusId == 2)
                    .ToList();

                var completedRequests = new List<object>();

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

                    completedRequests.Add(new
                    {
                        Id = request.Id,
                        Date = request.Date,
                        TimeSlot = request.TimeSlot.Title,
                        Address = $"{request.Address.Street}, {request.Address.City}, {request.Address.State} {request.Address.ZipCode}",
                        Services = services,
                        TotalPrice = totalPrice
                    });
                }

                return Ok(completedRequests);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}