const Project = require('../models/Project.js')
const sequelize = require('../models/Base')
const { saveFiles } = require('./general.js')
const logger = require('./logger.js')

const saveProjects = async () => {
  try {
    const projectsArr = await Project.findAll()
    const projects = await projectsArr.map(project => {
      const {
        FRP_SNO: code,
        FRP_REF: ref,
        FRP_Sponsor: sponsor,
        FRP_Grant: grant,
        FRP_TITLE: title,
        FRP_Duration: duration,
        FRP_FMonth: start_month,
        FRP_FYear: start_year,
        FRP_TMonth: end_month,
        FRP_TYear: end_year,
        FRP_Status: status
      } = project

      return {
        code,
        ref,
        sponsor,
        grant,
        title,
        duration,
        start_month,
        start_year,
        end_month,
        end_year,
        status
      }
    })
    const projs = await projects.map(async project => {
      const ciArr = await sequelize.query(
        `select FRI_Atid, FRI_Name,FRI_Type from FRInvestigators where FRI_Frpcode=${
          project.code
        }`,
        { type: sequelize.QueryTypes.SELECT }
      )
      let cis = []
      for (ci of ciArr) {
        const { FRI_Atid: researcher_id, FRI_Name: name, FRI_Type: type } = ci
        cis.push({
          researcher_id,
          type,
          name
        })
      }

      return { ...project, ci: cis }
    })
    const prjs = await Promise.all(projs)
    saveFiles('projects', 'projects', JSON.stringify(prjs))
  } catch (error) {
    logger.log('error', error)
  }
}

module.exports = { saveProjects }
