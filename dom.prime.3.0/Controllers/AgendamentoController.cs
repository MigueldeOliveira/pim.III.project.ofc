using DomPrime.Data;
using DomPrime.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DomPrime.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgendamentoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AgendamentoController(AppDbContext context)
        {
            _context = context;
        }

        // POST /api/agendamento
        [HttpPost]
        public async Task<IActionResult> CriarAgendamento([FromBody] Agendamento agendamento)
        {
            if (agendamento == null)
                return BadRequest(new { mensagem = "Dados inválidos." });

            // Valida campos obrigatórios
            if (string.IsNullOrWhiteSpace(agendamento.Nome) ||
                string.IsNullOrWhiteSpace(agendamento.Whatsapp) ||
                string.IsNullOrWhiteSpace(agendamento.Servico) ||
                string.IsNullOrWhiteSpace(agendamento.Horario))
            {
                return BadRequest(new { mensagem = "Preencha todos os campos." });
            }

            // Verifica conflito de horário na mesma data
            bool horarioExistente = await _context.Agendamentos.AnyAsync(a =>
                a.Data.Date == agendamento.Data.Date &&
                a.Horario == agendamento.Horario);

            if (horarioExistente)
                return BadRequest(new { mensagem = "Este horário já está reservado. Escolha outro." });

            _context.Agendamentos.Add(agendamento);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Agendamento realizado com sucesso!", id = agendamento.Id });
        }

        // GET /api/agendamento
        [HttpGet]
        public async Task<IActionResult> ListarAgendamentos()
        {
            var agendamentos = await _context.Agendamentos
                .OrderBy(a => a.Data)
                .ThenBy(a => a.Horario)
                .ToListAsync();

            return Ok(agendamentos);
        }

        // GET /api/agendamento/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> BuscarAgendamento(int id)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);

            if (agendamento == null)
                return NotFound(new { mensagem = "Agendamento não encontrado." });

            return Ok(agendamento);
        }

        // DELETE /api/agendamento/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelarAgendamento(int id)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);

            if (agendamento == null)
                return NotFound(new { mensagem = "Agendamento não encontrado." });

            _context.Agendamentos.Remove(agendamento);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Agendamento cancelado com sucesso." });
        }
    }
}
