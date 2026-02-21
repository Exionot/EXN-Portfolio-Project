from flask import Blueprint, render_template
from flask_login import login_required, current_user

views = Blueprint('views', __name__)

@views.route('/')
# @login_required
def home():
    print(current_user.is_authenticated)
    return render_template("home.html", isUserAuthenticated = current_user.is_authenticated)