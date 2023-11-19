using Microsoft.AspNetCore.Identity;
using Warehouse_App.Models;

namespace Warehouse_App
{
    public class Seeder
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public Seeder(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedAsync()
        {
            await AddDefaultRoles();
            await AddAdminUser();
        }

        private async Task AddAdminUser()
        {
            var newAdmin = new User()
            {
                UserName = "adminas",
                Email = "adminas@pastas.lt",
            };

            var exist = await _userManager.FindByNameAsync(newAdmin.UserName);
            if(exist == null) 
            {
                var create = await _userManager.CreateAsync(newAdmin, "TempPass!1");
                if (create.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newAdmin, Roles.SystemAdmin);
                }
            }
        }

        private async Task AddDefaultRoles()
        {
            foreach (var role in Roles.all)
            {
                var exists = await _roleManager.RoleExistsAsync(role);
                if (!exists)
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
