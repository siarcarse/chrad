import Joi from 'joi';
import Boom from 'boom';
const studiesRules = [{
    method: 'GET',
    path: '/api/studies/datatables/{param*}',
    config: {
        handler: (request, reply) => {
            var idate = request.query.idate;
            var fdate = request.query.fdate;
            var select = `SELECT
                            CASE mods_in_study 
                                WHEN 'CT\OT' THEN 'CT'
                                WHEN 'CT\SR' THEN 'CT'
                                WHEN 'SC\CT' THEN 'CT'
                                WHEN 'PR\MR' THEN 'MR'
                                WHEN 'CR\SR' THEN 'CR'
                                WHEN 'MR\SR' THEN 'MR'
                                WHEN 'US\SR' THEN 'US'
                                ELSE mods_in_study
                            END AS mods_in_study,
                            unnest(array_remove(array_agg( DISTINCT series.institution), NULL)) AS institution,
                            study_datetime, orden, accession_no, study_status AS status, study.users_inf, comment_num AS chat,
                            study.study_custom1 AS prioridad, study.request_time AS request, study.num_instances AS imagenes, study.study_custom3 AS critico, study.study_custom4 AS comment,
                            study.study_custom2 AS infomed,
                            (SELECT to_char((NOW() - study.request_time), 'DD "dias"-HH24 "hrs"-MI "min"')) as tiempo, study_desc, study.pk, pat_name, pat_id
                        FROM study
                        LEFT JOIN patient ON patient.pk=study.patient_fk
                        LEFT JOIN series ON series.study_fk=study.pk
                        WHERE study.study_datetime between TO_TIMESTAMP('${idate}', 'YYYY-MM-DD HH24:MI:SS') AND TO_TIMESTAMP('${fdate} 23:59:59', 'YYYY-MM-DD HH24:MI:SS')
                        GROUP BY study_datetime, orden, accession_no, study_status, study.users_inf, comment_num,
                        study.study_custom1, study.request_time, study.num_instances, study.study_custom3, study.study_custom4,study.study_custom2,study_desc, study.pk, pat_name, pat_id
                        ORDER BY study.study_datetime DESC`;
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
