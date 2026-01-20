import Project from "../models/project.model.js";

// Release funds for a project — only allowed for users with role 'mosje'
// Expects: req.params.id (project id) and req.body.amount (number)
// Behavior:
// - Validates authentication and role
// - Parses amount and ensures it's positive
// - Adds to `released_amount` but does not exceed `allocated_amount` if that is > 0
// - Returns previous and new released amount, and `actual_released` (amount actually added)

const releaseFunds = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    if (req.user.role !== "mosje")
      return res
        .status(403)
        .json({
          message: "Forbidden: only mosje users can release funds",
          success: false,
        });

    const projectId = req.params.id || req.body.projectId;
    if (!projectId)
      return res
        .status(400)
        .json({ message: "Project id is required", success: false });

    let amount = req.body.amount;
    // allow amount as string too
    if (typeof amount === "string") amount = amount.trim();
    amount = Number(amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({
          message: "A positive numeric `amount` is required",
          success: false,
        });
    }

    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found", success: false });

    const prevReleased = Number(project.released_amount || 0);
    const allocated = Number(project.allocated_amount || 0);

    let actualAdded = amount;
    let newReleased = prevReleased + amount;

    // If allocated_amount is set (>0), cap release to allocated amount
    if (allocated > 0 && newReleased > allocated) {
      actualAdded = Math.max(0, allocated - prevReleased);
      newReleased = prevReleased + actualAdded;
    }

    // No-op if nothing to add
    if (actualAdded <= 0) {
      return res
        .status(400)
        .json({
          message:
            "No funds available to release (would exceed allocated amount)",
          success: false,
        });
    }

    project.released_amount = newReleased;

    // Optionally store last release metadata (not required by schema but helpful if present)
    try {
      project.last_released_by = req.user._id;
      project.last_released_at = new Date();
    } catch (e) {
      // ignore if schema doesn't have these fields
    }

    await project.save();

    return res.json({
      message: "Funds released",
      success: true,
      project: {
        id: project._id,
        prev_released_amount: prevReleased,
        released_amount: project.released_amount,
        actual_released: actualAdded,
        allocated_amount: allocated,
      },
    });
  } catch (err) {
    console.error("releaseFunds error", err);
    return res
      .status(500)
      .json({
        message: "Failed to release funds",
        error: err.message,
        success: false,
      });
  }
};

export { releaseFunds };
