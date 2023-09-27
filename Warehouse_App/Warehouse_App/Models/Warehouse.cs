namespace Warehouse_App.Models
{
    public class Warehouse
    {
        public int warehouseId { get; set; }
        public Company Company { get; set; }
        public string city { get; set; }
        public string address { get; set; }
        public string maneger { get; set; }
    }
}
