namespace Warehouse_App.Models
{
    public class Company
    {
        public int companyId { get; set; }
        public string name { get; set; }
        public string city { get; set; }
        public string address { get; set; }
        public string owner { get; set; }
        public string email { get; set; }
        public DateTime created { get; set; }
    }
}
