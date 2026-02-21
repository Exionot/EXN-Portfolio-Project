from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        if user:
            if check_password_hash(user.password, password):
                flash('Login Success!', category='success')
                login_user(user, remember=True)
                return redirect(url_for('views.home'))
        else:
            flash('Invalid username or password', category='error')

    name = current_user.username if current_user.is_authenticated else "User"
    return render_template("admin-login.html", name=name)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.home'))

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm-password')

        user = User.query.filter_by(username = username).first()
        if user:
            flash('That user already exists!', category='error')
        elif len(username) < 2:
            flash('Username cannot be less than 2 characters!', category='error')
        elif not password:
            flash('Enter password!', category='error')
        elif not password == confirm_password:
            flash('Passwords do not match!', category='error')
        else:
            new_user = User(username=username, password=generate_password_hash(password, method='pbkdf2:sha256'))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('New user added!', category='success')
            return redirect(url_for('views.home'))
    
    return render_template("admin-signup.html")