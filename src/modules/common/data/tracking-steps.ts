import { TrackingStep } from "../classes/TrackingStep";

export const getTrackingSteps = () : Array<TrackingStep> => {
  const currentDate = new Date();
  return [
    {
      "id": 1,
      "name": "Creado",
      "description": "Plan de Clase Remedial creado por el docente",
      "status": "COMPLETED",
      "date": currentDate.toISOString(),
      "icon": "uil:create-dashboard"
    },
    {
      "id": 2,
      "name": "Firmado por el Docente",
      "description": "Plan de Clase Remedial firmado por el docente",
      "status": "INCOMPLETED",
      "date": "",
      "icon": "mdi:sign"
    },
    {
      "id": 3,
      "name": "Enviado al Director de Carrera",
      "description": "Plan de Clase Remedial enviado al Director de Carrera",
      "status": "INCOMPLETED",
      "date": "",
      "icon": "tabler:send"
    },
    {
      "id": 4,
      "name": "Validado por el Director de Carrera",
      "description": "Plan de Clase Remedial ha validar por el Director de carrera",
      "status": "INCOMPLETED",
      "date": "",
      "icon": "grommet-icons:validate"
    },
    {
      "id": 5,
      "name": "Firmado por el Director de Carrera",
      "description": "Plan de Clase Remedial firmado por el Director de Carrera",
      "status": "INCOMPLETED",
      "date": "",
      "icon": "streamline:interface-user-edit-actions-close-edit-geometric-human-pencil-person-single-up-user-write"
    },
    {
      "id": 6,
      "name": "Enviado al Docente y Estudiantes",
      "description": "Plan de Clase Remedial enviado al docente y a los Estudiantes",
      "status": "INCOMPLETED",
      "date": "",
      "icon": "pepicons-pencil:people"
    },
    {
      "id": 7,
      "name": "Aceptado por los estudiantes",
      "description": "Plan de Clase Remedial aceptado por los Estudiantes",
      "status": "INCOMPLETED",
      "date": "",
      "icon": "ph:student-light"
    },
    {
      "id": 8,
      "name": "Reporte enviado al Director y Docente",
      "description": "Plan de Clase Remedial enviado al Director de Carrera y Docente",
      "status": "INCOMPLETED",
      "date": "",
      "icon": "tabler:report"
    },
    {
      "id": 9,
      "name": "Finalizado",
      "description": "Proceso de Plan de Clase Remedial Culminado",
      "status": "INCOMPLETED",
      "date": "",
      "icon": "gis:flag-finish-b-o"
    }
  ]
}
