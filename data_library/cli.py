
import asyncio
import click
from pathlib import Path
from rich.console import Console
from rich.table import Table
from rich.markdown import Markdown

from data_library.file_search import upload_file, list_files, delete_file
from data_library.orchestrator import run_agentic_flow
from data_library.agents import init_db

console = Console()

@click.group()
def cli():
    """Agentic Data Library CLI"""
    init_db()  # Ensure seeds are present

@cli.command()
@click.argument('file_path', type=click.Path(exists=True))
def add(file_path):
    """Upload a document to the library."""
    console.print(f"[bold blue]Uploading {file_path}...[/bold blue]")
    try:
        f = upload_file(Path(file_path))
        console.print(f"[bold green]Success![/bold green] Uploaded: {f.name} (URI: {f.uri})")
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {e}")

@cli.command()
def list():
    """List documents in the library."""
    try:
        files = list_files()
        table = Table(title="Data Library Documents")
        table.add_column("Display Name", style="cyan")
        table.add_column("Name (ID)", style="dim")
        table.add_column("State", style="green")
        
        for f in files:
            table.add_row(f.display_name, f.name, f.state.name)
            
        console.print(table)
    except Exception as e:
        console.print(f"[bold red]Error listing files:[/bold red] {e}")

@cli.command()
@click.argument('file_name')
def delete(file_name):
    """Delete a document by its ID/Name."""
    try:
        delete_file(file_name)
        console.print(f"[bold green]Deleted {file_name}[/bold green]")
    except Exception as e:
        console.print(f"[bold red]Error deleting:[/bold red] {e}")

@cli.command()
def chat():
    """Start an interactive session with the Brand Assistant."""
    console.print("[bold green]🤖 Brand Workshop Assistant Ready[/bold green]")
    console.print("Type 'exit' to quit.\n")
    
    while True:
        user_input = click.prompt("You")
        if user_input.lower() in ['exit', 'quit']:
            break
            
        console.print("\n[dim]Thinking...[/dim]")
        
        try:
            # Run async loop
            response = asyncio.run(run_agentic_flow(user_input))
            
            console.print("\n[bold purple]Assistant:[/bold purple]")
            console.print(Markdown(str(response)))
            console.print("\n" + "-"*50 + "\n")
            
        except Exception as e:
            console.print(f"[bold red]Error in agent loop:[/bold red] {e}")

@cli.command()
@click.argument('query')
def analyze(query):
    """Run a single analysis query without starting chat mode."""
    console.print(f"[bold blue]Analyzing:[/bold blue] {query}")
    try:
        response = asyncio.run(run_agentic_flow(query))
        console.print("\n[bold purple]Result:[/bold purple]")
        console.print(Markdown(str(response)))
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {e}")

if __name__ == '__main__':
    cli()
