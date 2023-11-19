using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Warehouse_App.Models;

namespace Warehouse_App
{
    public class AppDB : IdentityDbContext<User>
    {
        private readonly IConfiguration _configuration;
        public DbSet<Company> Companies { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<User> AspNetUsers { get; set; }

        public AppDB(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_configuration.GetValue<string>("ConnectionStrings:PostgreSQL"));
        }
    }

    

}
