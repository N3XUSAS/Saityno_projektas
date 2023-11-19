namespace Warehouse_App
{
    public class Roles
    {
        public const string SystemAdmin = nameof(SystemAdmin);
        public const string CompanyAdmin = nameof(CompanyAdmin);
        public static readonly IReadOnlyCollection<string> all = new[] { SystemAdmin, CompanyAdmin }; 
    }
}
