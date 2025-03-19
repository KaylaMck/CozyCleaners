// UserAddressesController.cs
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
    [Authorize(Roles = "Client")]
    public class UserAddressesController : ControllerBase
    {
        private readonly CozyCleanersDbContext _dbContext;

        public UserAddressesController(CozyCleanersDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/UserAddresses
        [HttpGet]
        public IActionResult GetUserAddresses()
        {
            var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = _dbContext.UserProfiles
                .FirstOrDefault(up => up.IdentityUserId == identityUserId);

            if (userProfile == null)
            {
                return NotFound("User profile not found");
            }

            var addresses = _dbContext.UserAddresses
                .Where(ua => ua.UserProfileId == userProfile.Id)
                .Select(ua => new UserAddressDTO
                {
                    Id = ua.Id,
                    Street = ua.Street,
                    City = ua.City,
                    State = ua.State,
                    ZipCode = ua.ZipCode
                })
                .ToList();

            return Ok(addresses);
        }

        [HttpPost]
        public IActionResult CreateUserAddress(UserAddressDTO addressDTO)
        {
            var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = _dbContext.UserProfiles
                .FirstOrDefault(up => up.IdentityUserId == identityUserId);

            if (userProfile == null)
            {
                return NotFound("User profile not found");
            }

            var newAddress = new UserAddress
            {
                UserProfileId = userProfile.Id,
                Street = addressDTO.Street,
                City = addressDTO.City,
                State = addressDTO.State,
                ZipCode = addressDTO.ZipCode
            };

            _dbContext.UserAddresses.Add(newAddress);
            _dbContext.SaveChanges();

            addressDTO.Id = newAddress.Id;
            return Created($"/api/UserAddresses/{newAddress.Id}", addressDTO);
        }
    }
}