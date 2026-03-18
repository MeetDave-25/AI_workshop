from locust import HttpUser, task, between
import random

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    
    @task(5)
    def index(self):
        """Load homepage - most frequent task"""
        self.client.get("/", name="Homepage")
    
    @task(3)
    def navigation_about(self):
        """Navigate to about section"""
        self.client.get("/#about", name="About Section")
    
    @task(3)
    def navigation_workflow(self):
        """Navigate to workflow section"""
        self.client.get("/#workflow", name="Workflow Section")
    
    @task(2)
    def navigation_team(self):
        """Navigate to team section"""
        self.client.get("/#team", name="Team Section")
    
    @task(2)
    def navigation_tools(self):
        """Navigate to tools section"""
        self.client.get("/#tools", name="Tools Section")
    
    @task(2)
    def navigation_prompts(self):
        """Navigate to prompts section"""
        self.client.get("/#prompts", name="Prompts Section")
    
    @task(2)
    def navigation_certification(self):
        """Navigate to certification section"""
        self.client.get("/#certification", name="Certification Section")
    
    @task(2)
    def navigation_coupon(self):
        """Navigate to coupon section"""
        self.client.get("/#coupon", name="Coupon Section")
    
    @task(8)
    def load_images(self):
        """Load team member images"""
        images = [
            "/parth.jpeg",
            "/parth_p.jpeg",
            "/meet.jpeg",
            "/prithvi.jpeg",
            "/dhyey.jpeg",
            "/janvi.jpeg",
            "/disha.jpeg",
            "/p_ai.jpeg",
        ]
        image = random.choice(images)
        self.client.get(image, name="Team Image")
    
    @task(3)
    def check_responsive(self):
        """Simulate responsive design checks"""
        self.client.get("/", name="Responsive Check")

class AdminUser(HttpUser):
    """Simulate admin panel users"""
    wait_time = between(2, 5)
    
    @task(1)
    def visit_admin(self):
        """Visit admin dashboard"""
        self.client.get("/admin", name="Admin Dashboard")
    
    @task(1)
    def check_students(self):
        """Check students page"""
        self.client.get("/admin/students", name="Admin Students")
    
    @task(1)
    def check_prompts(self):
        """Check prompts page"""
        self.client.get("/admin/prompts", name="Admin Prompts")
    
    @task(1)
    def check_scanner(self):
        """Check scanner page"""
        self.client.get("/admin/scanner", name="Admin Scanner")
