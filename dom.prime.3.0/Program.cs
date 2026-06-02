using DomPrime.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ─── SERVIÇOS ─────────────────────────────────────────────────────────────────

// Controllers da API
builder.Services.AddControllers();

// Banco de dados via Entity Framework Core (SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS — permite o frontend chamar a API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// Swagger / OpenAPI (visível em /swagger em Development)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ─── PIPELINE ─────────────────────────────────────────────────────────────────

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Aplica migrações pendentes automaticamente na inicialização
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors("AllowAll");

// Serve os arquivos estáticos da pasta wwwroot (HTML, CSS, JS)
app.UseDefaultFiles();   // serve index.html automaticamente em /
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

// Mapeia os controllers da API ( /api/... )
app.MapControllers();

app.Run();
