if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
      console.log('Service Worker registrado con éxito:', registration);
    })
    .catch(function(error) {
      console.log('Fallo en el registro del Service Worker:', error);
    });
}



document.getElementById("iniciar").addEventListener("click", function () {
  const numSupervisores = parseInt(
    prompt("¿Cuántos supervisores hay disponibles hoy?")
  )

  if (isNaN(numSupervisores) || numSupervisores < 1) {
    alert("Por favor, ingrese un número válido de supervisores.")
    return
  }

  const supervisores = Array.from(
    { length: numSupervisores },
    (_, i) => `Supervisor ${i + 1}`
  )

  // Preguntar si es víspera de feriado
  const esVisperaFeriado = confirm(
    "¿Hoy es Viernes, Sábado o Víspera de feriado?"
  )

  const turnos = generarTurnos(supervisores, esVisperaFeriado)

  // Ordenar turnos por hora
  turnos.sort((a, b) => a.hora.localeCompare(b.hora))

  const turnosDiv = document.getElementById("turnos")
  turnosDiv.innerHTML = "" // Limpiar cualquier contenido anterior

  turnos.forEach((turno) => {
    const turnoDiv = document.createElement("div")
    turnoDiv.className = "turno"
    turnoDiv.innerText = `${turno.hora} - ${turno.supervisor} en Sector ${turno.sector}`
    turnosDiv.appendChild(turnoDiv)
  })

  // Mostrar el resumen de los últimos turnos
  mostrarResumen(turnos)
})

function generarTurnos(supervisores, esVisperaFeriado) {
  const turnos = []
  const sector41 = 41
  const sector1 = 1

  const horasBase = [
    "09:50",
    "10:10",
    "10:50",
    "11:10",
    "11:30",
    "11:50",
    "12:10",
    "12:30",
    "12:50",
    "13:10",
    "13:30",
    "13:50",
    "14:10",
    "14:30",
    "14:50",
    "15:10",
  ]
  let horas = horasBase

  if (esVisperaFeriado) {
    // Viernes, Sábado o víspera de feriado
    horas = horasBase
  } else {
    // Lunes, Martes, Miércoles, Jueves, Domingo
    horas = horasBase.slice(0, -1) // Excluye el último horario de 15:10
  }

  for (let i = 0; i < horas.length; i++) {
    const supervisorIndex = i % supervisores.length
    const supervisor = supervisores[supervisorIndex]
    const duracion = i === 0 || i === horas.length - 1 ? 20 : 40
    const sector = i >= 3 && i % 2 === 1 ? sector1 : sector41

    turnos.push({
      supervisor: supervisor,
      sector: sector,
      hora: horas[i],
      duracion: duracion,
      apertura: i === 3,
    })
  }

  return turnos
}

function mostrarResumen(turnos) {
  const resumenDiv = document.getElementById("resumen")
  resumenDiv.innerHTML = "<h2>Resumen de los últimos turnos</h2>"

  // Encontrar el último turno de cada sector
  const ultimosTurnosPorSector = {}

  turnos.forEach((turno) => {
    if (
      !ultimosTurnosPorSector[turno.sector] ||
      turno.hora > ultimosTurnosPorSector[turno.sector].hora
    ) {
      ultimosTurnosPorSector[turno.sector] = turno
    }
  })

  // Convertir el objeto en un array y ordenarlo por hora
  const ultimosTurnosArray = Object.values(ultimosTurnosPorSector)
  ultimosTurnosArray.sort((a, b) => a.hora.localeCompare(b.hora))

  // Mostrar los últimos turnos ordenados por hora
  ultimosTurnosArray.forEach((turno) => {
    const resumenTurnoDiv = document.createElement("div")
    resumenTurnoDiv.className = "resumen-turno"
    resumenTurnoDiv.innerText = `${turno.hora} - ${turno.supervisor} en Sector ${turno.sector} (Duración: ${turno.duracion} min)`
    resumenDiv.appendChild(resumenTurnoDiv)
  })
}
