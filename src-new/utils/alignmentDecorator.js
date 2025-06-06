/**
 * alignmentDecorator.js
 * Legacy decorator - replaced by milestone decorators
 * This file provides backward compatibility
 */

import { createMilestoneDecorators } from "./milestoneDecorators";

// Export the default milestone decorators in preview mode for compatibility
const alignmentDecorator = createMilestoneDecorators(true);

export default alignmentDecorator;
