using Microsoft.AspNetCore.Identity;

namespace Warehouse_App.Models
{
    public class User : IdentityUser
    {
        [PersonalData]
        public int CompanyId { get; set; }

        public bool ForceRelogin { get; set; }
    }
}
