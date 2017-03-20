import Joi from 'joi';
import Boom from 'boom';
const studiesRules = [{
    method: 'GET',
    path: '/api/studies/datatables/{param*}',
    config: {
        handler: (request, reply) => {
            var idate = request.query.idate;
            var fdate = request.query.fdate;
            var select = `SELECT study_datetime, orden, accession_no, study_status AS status, study.users_inf, comment_num AS chat,
                            study.study_custom1 AS prioridad, study.request_time AS request, num_instances AS imagenes, study.study_custom3 AS critico, study.study_custom4 AS comment,
                            study.study_custom2 AS infomed, mods_in_study,
                            (SELECT to_char((NOW() - study.request_time), 'DD "dias"-HH24 "hrs"-MI "min"')) as tiempo, study_desc, study.pk, pat_name, pat_id
                        FROM study
                            LEFT JOIN patient ON patient.pk=study.patient_fk
                        WHERE study.study_datetime between TO_TIMESTAMP('${idate}', 'YYYY-MM-DD HH24:MI:SS') AND TO_TIMESTAMP('${fdate}', 'YYYY-MM-DD HH24:MI:SS')
                        ORDER BY study.study_datetime`;
            request.pg.client.query(select, (err, result) => {
                let studies = result.rows;
                return reply(studies);
            })
        },
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0),
                idate: Joi.string().required(),
                fdate: Joi.string().required()
            })
        }
    }
}];
export default studiesRules;
