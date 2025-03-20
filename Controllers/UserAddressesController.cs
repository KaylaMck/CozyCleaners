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
    [Authorize]
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

        // Make sure this exists in your UserAddressesController.cs
        [HttpGet("{id}")]
        public IActionResult GetUserAddress(int id)
        {
            var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = _dbContext.UserProfiles
                .FirstOrDefault(up => up.IdentityUserId == identityUserId);

            if (userProfile == null)
            {
                return NotFound("User profile not found");
            }

            var address = _dbContext.UserAddresses
                .FirstOrDefault(ua => ua.Id == id && ua.UserProfileId == userProfile.Id);

            if (address == null)
            {
                return NotFound("Address not found");
            }

            var addressDTO = new UserAddressDTO
            {
                Id = address.Id,
                Street = address.Street,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode
            };

            return Ok(addressDTO);
        }
    }
}