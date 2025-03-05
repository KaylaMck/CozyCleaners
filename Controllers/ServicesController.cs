// ServicesController.cs
using Microsoft.AspNetCore.Mvc;
using CozyCleaners.Data;
using CozyCleaners.Models.DTOs;

namespace CozyCleaners.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly CozyCleanersDbContext _dbContext;

        public ServicesController(CozyCleanersDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/Services
        [HttpGet]
        public IActionResult GetServices()
        {
            var services = _dbContext.Services
                .Select(s => new ServiceDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Price = s.Price
                })
                .ToList();

            return Ok(services);
        }
    }
}