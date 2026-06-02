using DomPrime.Models;
using Microsoft.EntityFrameworkCore;

namespace DomPrime.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Agendamento> Agendamentos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Agendamento>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Whatsapp).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Servico).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Data).IsRequired();
                entity.Property(e => e.Horario).IsRequired().HasMaxLength(10);
            });
        }
    }
}
