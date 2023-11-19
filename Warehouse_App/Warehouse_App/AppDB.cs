using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Warehouse_App.Models;

namespace Warehouse_App
{
    public class AppDB : IdentityDbContext<User>
    {
        public AppDB(DbContextOptions<AppDB> options):base(options) { 
        
        }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<User> AspNetUsers { get; set; }
    }
    
}
