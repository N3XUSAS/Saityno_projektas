namespace Warehouse_App.Models
{
    public class Order
    {
        public int orderId { get; set; }
        public string code { get; set; }
        public string deliveryCity { get; set; }
        public string deliveryAddress { get; set;}
        public Warehouse warehouse { get; set;}
        public double weigth { get; set; }
        public string size { get; set; }
        public string phone { get; set; }
        public DateTime created { get; set; }
    }
}
