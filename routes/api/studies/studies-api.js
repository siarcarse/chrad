import Joi from 'joi';
import Boom from 'boom';
var moment = require('moment');
const studiesRules = [{
    method: 'GET',
    path: '/api/studies/datatables/{param*}',
    config: {
        handler: (request, reply) => {
            var idate = request.query.idate;
            var idate = '2018-02-01';
            var fdate = request.query.fdate;
            var institutions = request.query.institutions;
            var whereWord = `AND study.pk IN (SELECT study_fk FROM series WHERE institution IN (${institutions}))`;
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
                            to_char(study_datetime, 'YYYY-MM-DD HH24:MI:SS') AS study_datetime, orden, accession_no, study_status AS status, study.users_inf, comment_num AS chat,
                            study.study_custom1 AS prioridad, study.request_time AS request, study.num_instances AS imagenes, study.study_custom3 AS critico, study.study_custom4 AS comment,
                            study.study_custom2 AS infomed,
                            (SELECT to_char((NOW() - study.request_time), 'DD "dias"-HH24 "hrs"-MI "min"')) as tiempo, study_desc, study.pk, replace(replace(pat_name, '^^^', ''), '^', ' ') AS pat_name, pat_id
                        FROM study
                        LEFT JOIN patient ON patient.pk=study.patient_fk
                        LEFT JOIN series ON series.study_fk=study.pk
                        WHERE study.study_datetime between TO_TIMESTAMP('${idate}', 'YYYY-MM-DD HH24:MI:SS') AND TO_TIMESTAMP('${fdate} 23:59:59', 'YYYY-MM-DD HH24:MI:SS') ${whereWord}
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
                institutions: Joi.string(),
                fdate: Joi.string().required()
            })
        }
    }
}, {
    method: 'GET',
    path: '/api/studies/bypriority',
    config: {
        handler: (request, reply) => {
            var studies = request.query.studies;
            var select = `SELECT DISTINCT study_custom1 AS status, count(study_custom1) AS value FROM study WHERE pk IN (${studies}) GROUP BY study_custom1 ORDER BY study_custom1 ASC`;
            request.pg.client.query(select, (err, result) => {
                if (!err) {
                    return reply(result.rows);
                }
                return reply([]);
            })
        },
        validate: {
            query: Joi.object().keys({
                studies: Joi.string().allow('').required()
            })
        }
    }
}, {
    method: 'GET',
    path: '/api/studies/dashboard/',
    config: {
        handler: (request, reply) => {
            var user = request.query.user;
            var institutions = request.query.institutions;
            //var today = moment('2018-02-22').format('YYYY-MM-DD');
            var today = moment().format('YYYY-MM-DD');
            var whereWord = `AND study.pk IN (SELECT study_fk FROM series WHERE institution IN (${institutions}))`;
            var select = `SELECT count(pk) AS assigned FROM study WHERE users_inf=$1 AND study_datetime BETWEEN '${today}' AND '${today} 23:59:59' ${whereWord} AND study_status != 4`;
            request.pg.client.query(select, [user], (err, result) => {
                if (err) {
                    return reply([]);
                }
                var assigned = result.rows.length > 0 ? result.rows[0] : 0;
                var select = `SELECT count(pk) AS urgentes FROM study WHERE study_custom1 IN ('Urgente', 'Muy Urgente')  AND study_status != 4 AND study_datetime BETWEEN '${today}' AND '${today} 23:59:59' ${whereWord}`;
                request.pg.client.query(select, (err, result) => {
                    if (err) {
                        return reply([]);
                    }
                    var urgentes = result.rows.length > 0 ? result.rows[0] : 0;
                    var select = `SELECT count(pk) AS normal FROM study WHERE study_custom1 IN ('24 Hrs', 'Normal', '') AND study_status != 4 AND study_datetime BETWEEN '${today}' AND '${today} 23:59:59' ${whereWord}`;
                    request.pg.client.query(select, (err, result) => {
                        if (err) {
                            return reply([]);
                        }
                        var normal = result.rows.length > 0 ? result.rows[0] : 0;
                        return reply({ assigned: parseInt(assigned.assigned), normal: parseInt(normal.normal), urgentes: parseInt(urgentes.urgentes) });
                    });
                });
            })
        },
        validate: {
            query: Joi.object().keys({
                user: Joi.string().required(),
                institutions: Joi.string().allow('').required()
            })
        }
    }
}, {
    method: 'POST',
    path: '/api/study/update/any',
    config: {
        handler: (request, reply) => {
            var rows = request.payload.rows;
            var study = request.payload.study;
            var querys = [];
            var values = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                querys.push(`${row.row}=$${i+1}`);
                values.push(row.value);
            }
            var updateSql = querys.join(', ');
            values.push(study);
            var sql = `UPDATE study SET ${updateSql} WHERE pk=$${i + 1}`;
            request.pg.client.query(sql, values, (err, result) => {
                return reply([]);
            });
        },
        validate: {
            payload: Joi.object().keys({
                rows: Joi.array().required(),
                study: Joi.number().required()
            })
        }
    }
}];
export default studiesRules;