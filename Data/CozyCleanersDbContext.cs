using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using CozyCleaners.Models;
using Microsoft.AspNetCore.Identity;

namespace CozyCleaners.Data;
public class CozyCleanersDbContext : IdentityDbContext<IdentityUser>
{
    private readonly IConfiguration _configuration;
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<UserAddress> UserAddresses { get; set; }
    public DbSet<CleaningRequest> CleaningRequests { get; set; }
    public DbSet<RequestService> RequestServices { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<TimeSlot> TimeSlots { get; set; }
    public DbSet<Status> Statuses { get; set; }

    public CozyCleanersDbContext(DbContextOptions<CozyCleanersDbContext> context, IConfiguration config) : base(context)
    {
        _configuration = config;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
        {
            Id = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
            Name = "Admin",
            NormalizedName = "admin"
        });

        modelBuilder.Entity<IdentityUser>().HasData(new IdentityUser
        {
            Id = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            UserName = "Administrator",
            Email = "admina@strator.comx",
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, _configuration["AdminPassword"])
        });

        modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
        {
            RoleId = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
            UserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f"
        });

        modelBuilder.Entity<UserProfile>().HasData(new UserProfile
        {
            Id = 1,
            IdentityUserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            FirstName = "Admina",
            LastName = "Strator"
        });

        modelBuilder.Entity<Status>().HasData(
            new Status { Id = 1, Title = "Scheduled" },
            new Status { Id = 2, Title = "Completed" },
            new Status { Id = 3, Title = "Canceled" }
        );

        modelBuilder.Entity<TimeSlot>().HasData(
            new TimeSlot { Id = 1, Title = "Morning", StartTime = "10:00 AM", EndTime = "3:00 PM" },
            new TimeSlot { Id = 2, Title = "Afternoon", StartTime = "12:00 PM", EndTime = "5:00 PM" },
            new TimeSlot { Id = 3, Title = "Evenings", StartTime = "2:00 PM", EndTime = "8:00 PM" }
        );

        modelBuilder.Entity<Service>().HasData(
            new Service { Id = 1, Name = "Basic Cleaning", Description = "General cleaning of all rooms.", Price = 50.00m },
            new Service { Id = 2, Name = "Deep Cleaning", Description = "Thorough cleaning including baseboards and behind appliances.", Price = 100.00m },
            new Service { Id = 3, Name = "Move-out Cleaning", Description = "Full deep cleaning for moving out", Price = 150.00m }
        );
    }
}