import Job from "../model/job.model.js"
import Company from "../model/company.model.js";

export const postJob = async(req , res) =>{
    try{
        const {title , description , requirements , salary , location , jobType , experience , position , companyId} = req.body
        const userId = req.id

        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message : "Something is Missing",
                success : false
            })
        }

        const job = await Job.create({
            title,
            description,
            requirements : requirements.split(" , "),
            salary : Number(salary),
            location,
            jobType,
            experienceLevel : Number(experience),
            position,
            company : companyId,
            created_by : userId
        })
        return res.status(201).json({
                message : "New job created successfully",
                job,
                success : true
            })
    }catch(err){
        console.log(err);
    }
}


export const getAllJobs = async(req , res) =>{
    try{
        const keyword = req.query.keyword || ""     //req.query.keyword → value from URL if any otherwise keep it ("") i.e empty.
        const query = {
            $or : [                                                         //If:keyword = "react"   Then query becomes:👉 Find jobs where:  title contains "react" OR description contains "react"
                {title : {$regex : keyword , $options : "i"}},
                {description : {$regex : keyword , $options : "i"}}
            ]
        }
        const jobs = await Job.find(query).populate({       //With populate → you get full company data
            path:"company"
        }).sort({createdAt : -1})           //show latest first old later.
        if(!jobs){
            return res.status(404).json({
                message : "Jobs Not Found",
                success : false
            })
        }
        return res.status(200).json({
                jobs,
                success : true
        })
        
    }catch(err){
        console.log(err);
    }
}


export const getJobById = async (req , res) =>{
    try{
        const jobId = req.params.id
        const job = await Job.findById(jobId).populate({
            path : "applications"
        })
        if(!job){
            return res.status(404).json({
                message : "Jobs Not Found",
                success : false
            })
        }
        return res.status(200).json({
                job,
                success : true
        })
    }catch(err){
        console.log(err);
        
    }
}

export const getAdminJobs = async(req , res) =>{
    try{
        const adminId = req.id
        const jobs = await Job.find({ created_by: adminId })
            .populate("company")
            .sort({ createdAt: -1 });


        if(!jobs){
            return res.status(404).json({
                message : "Jobs Not Found",
                success : false
            })
        }
        return res.status(200).json({
                jobs,
                success : true
        })
    }catch(err){
        console.log(err);
        
    }
}

export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId
        } = req.body;

        // Find the job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Check whether this recruiter created the job
        if (job.created_by.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this job",
                success: false
            });
        }

        // Check whether the selected company belongs to this recruiter
        if (companyId) {
            const company = await Company.findOne({
                _id: companyId,
                userId: userId
            });

            if (!company) {
                return res.status(403).json({
                    message: "Invalid company selection",
                    success: false
                });
            }

            job.company = companyId;
        }

        // Update job fields
        if (title !== undefined) job.title = title;
        if (description !== undefined) job.description = description;

        if (requirements !== undefined) {
            job.requirements = Array.isArray(requirements)
                ? requirements
                : requirements.split(",").map(item => item.trim()).filter(Boolean);
        }

        if (salary !== undefined) job.salary = Number(salary);
        if (location !== undefined) job.location = location;
        if (jobType !== undefined) job.jobType = jobType;
        if (experience !== undefined) job.experienceLevel = Number(experience);
        if (position !== undefined) job.position = Number(position);

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully",
            job,
            success: true
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};