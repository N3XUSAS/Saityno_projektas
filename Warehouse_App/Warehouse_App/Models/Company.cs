using System.ComponentModel.DataAnnotations;

namespace Warehouse_App.Models
{
    public class Company
    {
        public int companyId { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,40}$")]
        public string name { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,25}$")]
        public string city { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,50}$")]
        public string address { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,50}$")]
        public string owner { get; set; }
        [Required]
        [EmailAddress]
        public string email { get; set; }
        public DateTime created { get; set; }
    }
}
