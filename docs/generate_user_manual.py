from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "manual-usuario-todo-app.pdf"


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="ManualTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=colors.HexColor("#0f172a"),
            alignment=TA_LEFT,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ManualHeading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#1d4ed8"),
            spaceBefore=10,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ManualBody",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#1f2937"),
            spaceAfter=6,
        )
    )
    return styles


def bullet_list(items, styles):
    return ListFlowable(
        [
            ListItem(Paragraph(item, styles["ManualBody"]), leftIndent=8)
            for item in items
        ],
        bulletType="bullet",
        start="circle",
        leftIndent=18,
    )


def numbered_list(items, styles):
    return ListFlowable(
        [
            ListItem(Paragraph(item, styles["ManualBody"]), leftIndent=8)
            for item in items
        ],
        bulletType="1",
        leftIndent=18,
    )


def main():
    styles = build_styles()
    story = []

    story.append(Paragraph("Manual de Usuario - To Do App Ionic", styles["ManualTitle"]))
    story.append(
        Paragraph(
            "Documento funcional para uso final de la aplicacion de gestion de tareas.",
            styles["ManualBody"],
        )
    )
    story.append(
        Paragraph("Fecha de generacion: 2026-04-25", styles["ManualBody"])
    )
    story.append(Spacer(1, 0.2 * cm))

    sections = [
        (
            "1. Objetivo",
            [
                "La aplicacion permite crear, organizar, completar y filtrar tareas desde una sola pantalla.",
            ],
            "bullet",
        ),
        (
            "2. Pantalla principal",
            [
                "Panel lateral para administrar categorias.",
                "Panel principal para crear tareas, ver indicadores y aplicar filtros.",
                "Resumen rapido con total, pendientes y completadas.",
            ],
            "bullet",
        ),
        (
            "3. Crear una categoria",
            [
                "Ubica el panel <b>Categorias</b>.",
                "Escribe el nombre en el campo de texto.",
                "Presiona <b>Agregar categoria</b>.",
            ],
            "number",
        ),
        (
            "4. Editar o eliminar una categoria",
            [
                "Presiona <b>Editar</b> para cambiar el nombre y luego <b>Guardar</b>.",
                "Presiona <b>Eliminar</b> para quitarla.",
                "Si una tarea usaba esa categoria, la tarea queda como <b>Sin categoria</b>.",
            ],
            "bullet",
        ),
        (
            "5. Crear una tarea",
            [
                "Escribe el nombre en <b>Agrega tu tarea</b>.",
                "Selecciona una categoria si aplica.",
                "Presiona <b>Agregar</b>.",
            ],
            "number",
        ),
        (
            "6. Completar, editar o eliminar una tarea",
            [
                "Marca el checkbox para completarla.",
                "Usa <b>Editar</b> para cambiar titulo o categoria.",
                "Usa <b>Eliminar</b> para quitarla del listado.",
            ],
            "bullet",
        ),
        (
            "7. Filtrar tareas",
            [
                "Abre <b>Filtro por categoria</b> y elige <b>Todas</b> o una categoria especifica.",
                "Abre <b>Filtro por estado</b> y elige <b>Todo</b>, <b>Pendiente</b> o <b>Completado</b>.",
            ],
            "bullet",
        ),
        (
            "8. Persistencia",
            [
                "La informacion se guarda automaticamente en el dispositivo usando <b>localStorage</b>.",
                "Si se limpia el almacenamiento local o se reinstala la app, la informacion puede perderse.",
            ],
            "bullet",
        ),
        (
            "9. Feature flags",
            [
                "<b>enable_task_editing</b> controla si el usuario puede editar tareas.",
                "<b>show_status_filters</b> controla si se muestra el filtro por estado.",
            ],
            "bullet",
        ),
        (
            "10. Solucion de problemas",
            [
                "Si no ves cambios, recarga la aplicacion.",
                "Si no aparece <b>Editar</b>, revisa la flag <b>enable_task_editing</b>.",
                "Si no aparece el filtro por estado, revisa la flag <b>show_status_filters</b>.",
            ],
            "bullet",
        ),
    ]

    for title, items, list_type in sections:
        story.append(Paragraph(title, styles["ManualHeading"]))
        if list_type == "number":
            story.append(numbered_list(items, styles))
        else:
            story.append(bullet_list(items, styles))
        story.append(Spacer(1, 0.15 * cm))

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        title="Manual de Usuario - To Do App Ionic",
        author="OpenAI Codex",
    )
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    main()
