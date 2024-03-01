const express = require('express')
const routers = express.Router()
const count = require("../middleware/count")
const authorization = require('../middleware/authorization')
const authenticate = require('../middleware/authotication')
const userController = require('../app/controller/userController')
const companyController = require('../app/controller/companyController')
const job_collection_controller = require('../app/controller/jobCollectionController')
const jobSeekerProfileController = require('../app/controller/job_seeker_profile_controller')
const multer = require('multer');
const applictionController = require('../app/controller/applicatonController')


const upload = multer({ dest: 'uploads/' })

// user routers
routers.post('/api/user/regist', count, userController.regist)
routers.post('/api/user/login', userController.login)
routers.get('/api/user/info', authenticate, userController.info)
routers.get('/api/user/list', authenticate, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorization, userController.list)

//COMPANY ROUTES
// company Routers
routers.post('/api/company/create', authenticate, (req, res, next) => {
    req.permittedRoles = ['admin', 'employer']
    next()
}, authorization, companyController.create)
// employer company details
routers.get('/api/company/details', authenticate, (req, res, next) => {
    req.permittedRoles = ['employer']
    next()
}, authorization, companyController.employerCompanyDtls)
routers.get('/api/company/details/admin', authenticate, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorization, companyController.list)
//JOB Posts ROUTES
// job routers
routers.post('/api/job/create', authenticate, (req, res, next) => {
    req.permittedRoles = ['employer']
    next()
}, authorization, job_collection_controller.create)
routers.get('/api/employes/jobs', authenticate, (req, res, next) => {
    req.permittedRoles = ['employer']
    next()
}, authorization, job_collection_controller.list)
routers.get('/api/employes/job/:id', authenticate, (req, res, next) => {
    req.permittedRoles = ['employer', 'jobseeker']
    next()
}, authorization, job_collection_controller.show)
// joseeker route to get all jobs
routers.get('/api/jobs/all', authenticate, (req, res, next) => {
    req.permittedRoles = ['jobseeker', 'admin']
    next()
}, authorization, job_collection_controller.jobsList)
//job search api
routers.get('/api/jobs/search', authenticate, (req, res, next) => {
    req.permittedRoles = ['jobseeker']
    next()
}, authorization, job_collection_controller.search)
//job sort api
routers.get('/api/jobs/sort', authenticate, (req, res, next) => {
    req.permittedRoles = ['jobseeker']
    next()
}, authorization, job_collection_controller.sort)
//delete job post
routers.post('/api/admin/delete/job/post/:id', authenticate, (req, res, next) => {
    req.permittedRoles = ['admin', 'employer']
    next()
}, authorization, job_collection_controller.destroy)
//edit job post
routers.post('/api/admin/edit/job/post/:id', authenticate, (req, res, next) => {
    req.permittedRoles = ['admin', 'employer']
    next()
}, authorization, job_collection_controller.update)


//job seeker profile update
routers.post('/api/jobseeker/profileup', authenticate, upload.single('resume'), jobSeekerProfileController.update)

// JOB APPLICATION ROUTES
//job application apply
routers.post('/api/jobseeker/jobApplication', authenticate, (req, res, next) => {
    req.permittedRoles = ['jobseeker']
    next()
}, authorization, upload.single('resume'), applictionController.create)
//Get job application employe
routers.get('/api/employe/application', authenticate, (req, res, next) => {
    req.permittedRoles = ['employer']
    next()
}, authorization, applictionController.employesJobApplication)
//Get job application jobseeker
routers.get('/api/jobseeker/application', authenticate, (req, res, next) => {
    req.permittedRoles = ['jobseeker']
    next()
}, authorization, applictionController.list)
routers.get('/api/all/application', authenticate, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorization, applictionController.allApplicationList)

routers.post('/api/employer/application/:id', authenticate, (req, res, next) => {
    req.permittedRoles = ['employer']
    next()
}, authorization, applictionController.update)
routers.get('/api/employer/view/application/:id', authenticate, (req, res, next) => {
    req.permittedRoles = ['employer']
    next()
}, authorization, applictionController.showId)
module.exports = routers