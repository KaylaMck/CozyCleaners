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
    public DbSet<ClaimedRequest> ClaimedRequests { get; set; }

    public CozyCleanersDbContext(DbContextOptions<CozyCleanersDbContext> context, IConfiguration config) : base(context)
    {
        _configuration = config;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Define user roles
        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole
            {
                Id = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Id = "ff4f7ced-cad4-4035-9dd1-2e39ada7f83b",
                Name = "Client",
                NormalizedName = "CLIENT"
            },
            new IdentityRole
            {
                Id = "06bb4a33-d197-4991-bd9e-9c130e387cca",
                Name = "Cleaner",
                NormalizedName = "CLEANER"
            }
        );

        // Admin user
        modelBuilder.Entity<IdentityUser>().HasData(new IdentityUser
        {
            Id = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            UserName = "Administrator",
            NormalizedUserName = "ADMINISTRATOR",
            Email = "admina@strator.comx",
            NormalizedEmail = "ADMINA@STRATOR.COMX",
            EmailConfirmed = true,
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, _configuration["AdminPassword"])
        });

        // Demo client user
        modelBuilder.Entity<IdentityUser>().HasData(new IdentityUser
        {
            Id = "e31d1fe4-7fb6-4129-a1c9-f9f9a3127212",
            UserName = "demo@cozy.com",
            NormalizedUserName = "DEMO@COZY.COM",
            Email = "demo@cozy.com",
            NormalizedEmail = "DEMO@COZY.COM",
            EmailConfirmed = true,
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, "Demo123!")
        });

        // Demo cleaner user
        modelBuilder.Entity<IdentityUser>().HasData(new IdentityUser
        {
            Id = "a7d3af36-1784-4e4b-a18a-547616f2284a",
            UserName = "cleaner@cozy.com",
            NormalizedUserName = "CLEANER@COZY.COM",
            Email = "cleaner@cozy.com",
            NormalizedEmail = "CLEANER@COZY.COM",
            EmailConfirmed = true,
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, "Cleaner123!")
        });

        // Role assignments
        modelBuilder.Entity<IdentityUserRole<string>>().HasData(
            new IdentityUserRole<string>
            {
                RoleId = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                UserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f"  // Admin user
            },
            new IdentityUserRole<string>
            {
                RoleId = "ff4f7ced-cad4-4035-9dd1-2e39ada7f83b",
                UserId = "e31d1fe4-7fb6-4129-a1c9-f9f9a3127212"  // Demo client user
            },
            new IdentityUserRole<string>
            {
                RoleId = "06bb4a33-d197-4991-bd9e-9c130e387cca",
                UserId = "a7d3af36-1784-4e4b-a18a-547616f2284a"  // Demo cleaner user
            }
        );

        // User profiles
        modelBuilder.Entity<UserProfile>().HasData(
            new UserProfile
            {
                Id = 1,
                IdentityUserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                FirstName = "Admina",
                LastName = "Strator"
            },
            new UserProfile
            {
                Id = 2,
                IdentityUserId = "e31d1fe4-7fb6-4129-a1c9-f9f9a3127212",
                FirstName = "Demo",
                LastName = "User"
            },
            new UserProfile
            {
                Id = 3,
                IdentityUserId = "a7d3af36-1784-4e4b-a18a-547616f2284a",
                FirstName = "Cleaner",
                LastName = "Demo"
            }
        );

        // Statuses
        modelBuilder.Entity<Status>().HasData(
            new Status { Id = 1, Title = "Scheduled" },
            new Status { Id = 2, Title = "Completed" },
            new Status { Id = 3, Title = "Canceled" },
            new Status { Id = 4, Title = "In Progress" }
        );

        // Time slots
        modelBuilder.Entity<TimeSlot>().HasData(
            new TimeSlot { Id = 1, Title = "Morning", StartTime = "10:00 AM", EndTime = "3:00 PM" },
            new TimeSlot { Id = 2, Title = "Afternoon", StartTime = "12:00 PM", EndTime = "5:00 PM" },
            new TimeSlot { Id = 3, Title = "Evenings", StartTime = "2:00 PM", EndTime = "8:00 PM" }
        );

        // Services
        modelBuilder.Entity<Service>().HasData(
            new Service { Id = 1, Name = "Basic Cleaning", Description = "General cleaning of all rooms.", Price = 100.00m },
            new Service { Id = 2, Name = "Deep Cleaning", Description = "Thorough cleaning including baseboards and behind appliances.", Price = 175.00m },
            new Service { Id = 3, Name = "Move-out Cleaning", Description = "Full deep cleaning for moving out", Price = 250.00m }
        );

        // Demo user address
        modelBuilder.Entity<UserAddress>().HasData(
            new UserAddress
            {
                Id = 100, // Using higher ID to avoid conflicts
                UserProfileId = 2, // Demo User
                Street = "123 Main Street",
                City = "Nashville",
                State = "TN",
                ZipCode = "37203"
            }
        );

        // Sample cleaning requests for demo
        modelBuilder.Entity<CleaningRequest>().HasData(
            new CleaningRequest
            {
                Id = 100,
                ClientId = 2, // Demo User
                Date = DateTime.Now.AddDays(3),
                TimeSlotId = 1,
                StatusId = 1, // Scheduled
                AddressId = 100
            },
            new CleaningRequest
            {
                Id = 101,
                ClientId = 2, // Demo User
                Date = DateTime.Now.AddDays(-10),
                TimeSlotId = 2,
                StatusId = 2, // Completed
                AddressId = 100
            },
            new CleaningRequest
            {
                Id = 102,
                ClientId = 2, // Demo User
                Date = DateTime.Now.AddDays(-5),
                TimeSlotId = 3,
                StatusId = 3, // Canceled
                AddressId = 100
            }
        );

        // Services for demo cleaning requests
        modelBuilder.Entity<RequestService>().HasData(
            new RequestService
            {
                Id = 100,
                RequestId = 100,
                ServiceId = 1, // Basic Cleaning
                Quantity = 1
            },
            new RequestService
            {
                Id = 101,
                RequestId = 101,
                ServiceId = 2, // Deep Cleaning
                Quantity = 1
            },
            new RequestService
            {
                Id = 102,
                RequestId = 102,
                ServiceId = 3, // Move-out Cleaning
                Quantity = 1
            }
        );
    }
}