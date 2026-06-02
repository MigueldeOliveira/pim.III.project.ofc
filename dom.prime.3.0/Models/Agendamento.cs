using System.ComponentModel.DataAnnotations;

namespace DomPrime.Models
{
    public class Agendamento
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Whatsapp { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Servico { get; set; } = string.Empty;

        [Required]
        public DateTime Data { get; set; }

        [Required]
        [MaxLength(10)]
        public string Horario { get; set; } = string.Empty;
    }
}
