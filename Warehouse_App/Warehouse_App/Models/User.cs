using Microsoft.AspNetCore.Identity;

namespace Warehouse_App.Models
{
    public class User : IdentityUser
    {
        [PersonalData]
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }

        public bool ForceRelogin { get; set; }
    }
}
