using System.ComponentModel.DataAnnotations;

namespace Warehouse_App.Models
{
    public class Warehouse
    {
        public int warehouseId { get; set; }
        public Company Company { get; set; }
        [MaxLength(25)]
        public string city { get; set; }
        public string address { get; set; }
        public string maneger { get; set; }
    }
}
